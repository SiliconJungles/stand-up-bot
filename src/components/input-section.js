import React from 'react'

import { useMutation } from 'react-apollo'
import {
  ADD_HELP,
  ADD_PAIR,
  ADD_SHARE,
  DELETE_HELP,
  DELETE_PAIR,
  DELETE_SHARE,
  UPDATE_HELP,
  UPDATE_PAIR,
  UPDATE_SHARE,
} from '../services/graphql/mutations'

import { Controlled as CodeMirror } from 'react-codemirror2'
import '../codemirror.css'
import 'codemirror/keymap/vim.js'

import { StoreContext } from '../services/store'

const useMutationReducer = type => {
  const [addHelp] = useMutation(ADD_HELP)
  const [addPair] = useMutation(ADD_PAIR)
  const [addShare] = useMutation(ADD_SHARE)
  const [deleteHelp] = useMutation(DELETE_HELP)
  const [deletePair] = useMutation(DELETE_PAIR)
  const [deleteShare] = useMutation(DELETE_SHARE)
  const [updateHelp] = useMutation(UPDATE_HELP)
  const [updatePair] = useMutation(UPDATE_PAIR)
  const [updateShare] = useMutation(UPDATE_SHARE)
  switch (type) {
    case 'sharing':
      return {
        mutation: { add: addShare, update: updateShare, delete: deleteShare },
      }
    case 'pairing':
      return {
        mutation: { add: addPair, update: updatePair, delete: deletePair },
      }
    case 'help':
      return {
        mutation: { add: addHelp, update: updateHelp, delete: deleteHelp },
      }
    default:
      return false
  }
}

export default ({ type, description }) => {
  const [editableItem, setEditableItem] = React.useState(null)
  const [input, setInput] = React.useState('')
  const [removeItem, setRemoveItem] = React.useState('')
  const {
    [type]: [data, setData],
    vimMode,
  } = React.useContext(StoreContext)

  const { mutation } = useMutationReducer(type)

  React.useEffect(() => {
    if (removeItem === '') return
    if (window.confirm('Are you sure you wish to delete?')) {
      const newData = data.filter(i => i !== data[removeItem])
      mutation.delete({ variables: { id: data[removeItem].id } })
      setData(newData)
      if (type === 'pairing')
        localStorage.setItem('pairing', JSON.stringify(newData))
    }
    setRemoveItem('')
  }, [data, mutation, removeItem, setData, type])

  const addItem = e => {
    e && e.preventDefault()
    if (!input) return
    const newItem = [{ value: input }, ...data]
    setData(newItem)
    mutation.add({ variables: { input } })
    if (type === 'pairing')
      localStorage.setItem('pairing', JSON.stringify(newItem))
    setInput('')
  }

  const editItem = e => {
    e && e.preventDefault()
    data[editableItem].value = input
    setData(data)
    mutation.update({
      variables: { id: data[editableItem].id, editedItem: input },
    })
    setInput('')
    setEditableItem(null)
  }

  const onVimEnterPress = e => {
    e === 'add' ? addItem() : editItem()
  }
  return (
    <div className="section" data-testid={type}>
      <h5>{type.charAt(0).toUpperCase() + type.slice(1)}</h5>
      {data.length > 0 && (
        <ul className="collection" data-testid={`${type}-items`}>
          {data.map((s, index) => (
            <li key={index} className="collection-item">
              {editableItem === index ? (
                <form onSubmit={editItem}>
                  <a href="#/" onClick={() => setEditableItem(null)}>
                    <i
                      data-testid={`remove-${type}${index}`}
                      className="cobalt-icons right"
                    >
                      close
                    </i>
                  </a>
                  {vimMode ? (
                    <CodeMirror
                      value={input || s.value}
                      options={{
                        keyMap: 'vim',
                        extraKeys: {
                          Enter: () => onVimEnterPress('edit'),
                        },
                      }}
                      onBeforeChange={(editor, data, value) => {
                        setInput(value)
                      }}
                      onChange={(editor, data, value) => {
                        setInput(value)
                      }}
                    />
                  ) : (
                    <input
                      autoFocus
                      placeholder={description}
                      aria-label={`${type}-input`}
                      type="text"
                      value={input || s.value}
                      onChange={e => setInput(e.target.value)}
                    />
                  )}
                  <small>Press Enter to save</small>
                </form>
              ) : (
                <div>
                  {s.value}
                  <a
                    href="#/"
                    onClick={() => setRemoveItem(index)}
                    tabIndex="-1"
                  >
                    <i
                      data-testid={`remove-${type}${index}`}
                      className="material-icons right"
                    >
                      delete
                    </i>
                  </a>
                  <a
                    href="#/"
                    onClick={() => setEditableItem(index)}
                    tabIndex="-1"
                  >
                    <i
                      data-testid={`remove-${type}${index}`}
                      className="material-icons right"
                    >
                      edit
                    </i>
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {editableItem === null && (
        <form onSubmit={addItem}>
          {vimMode ? (
            <CodeMirror
              value={input}
              options={{
                keyMap: 'vim',
                showCursorWhenSelecting: true,
                extraKeys: {
                  Enter: () => onVimEnterPress('add'),
                },
              }}
              onBeforeChange={(editor, data, value) => {
                setInput(value)
              }}
            />
          ) : (
            <input
              placeholder={description}
              aria-label={`${type}-input`}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          )}
          {input && (
            <span
              className="helper-text"
              data-error="wrong"
              data-success="right"
            >
              <small>Press Enter to save</small>
            </span>
          )}
        </form>
      )}
    </div>
  )
}
