import React, {useContext} from 'react'
import {motion} from 'framer-motion'
import styled from 'styled-components'
import InputSection from './InputSection'
import Navbar from './navbar'
import {StoreContext} from '../services/store'
import CovidStats from './CovidStats'
import Footer from './Footer'
import PublishButtons from './PublishButtons'

const Body = () => {
  const {current, send} = useContext(StoreContext)

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 1.5}}
    >
      <Navbar />
      <StyledBody>
        <CardContainer>
          <CovidStats send={send} />
          <InputSection
            title="sharing"
            placeholder="What are your thoughts?.."
            data={current.context['sharing']}
            send={send}
            inputValue={current.context.inputValues['sharing']}
            editableItem={current.context.editableItem}
            editableValue={current.context.editableValue}
            loading={current.context.loading}
          />
          <InputSection
            title="help"
            placeholder="Anyone need help?..."
            data={current.context['assistance']}
            send={send}
            inputValue={current.context.inputValues['help']}
            editableItem={current.context.editableItem}
            editableValue={current.context.editableValue}
            loading={current.context.loading}
          />
          <InputSection
            title="pairing"
            placeholder="Pairing Config..."
            data={current.context['pairs']}
            send={send}
            inputValue={current.context.inputValues['pairing']}
            editableItem={current.context.editableItem}
            editableValue={current.context.editableValue}
            loading={current.context.loading}
          />
          <PublishButtons
            sessionId={current.context.activeSession.id}
            send={send}
          />
        </CardContainer>
      </StyledBody>
      <Footer />
    </motion.div>
  )
}

const StyledBody = styled.div.attrs({
  className: 'row',
})`
  margin-top: 20px;
`

const CardContainer = styled.div.attrs({
  className: 'card-content container',
})``

export default Body
