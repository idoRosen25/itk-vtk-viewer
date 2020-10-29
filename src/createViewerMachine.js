import { Machine } from 'xstate'
import createRenderingMachine from './Rendering/createRenderingMachine'
import createUIMachine from './UI/createUIMachine'

const createViewerMachine = (options, context) => {
  const { uiOptions, renderingOptions } = options
  const renderingMachine = createRenderingMachine(renderingOptions, context)
  const uiMachine = createUIMachine(uiOptions, context)

  return Machine(
    {
      id: 'viewer',
      strict: true,
      initial: 'idle',
      context,
      states: {
        idle: {
          always: {
            target: 'active',
            actions: ['createContainer', 'styleContainer'],
          },
        },
        active: {
          invoke: [
            {
              id: 'ui',
              src: uiMachine,
              autoForward: true,
            },
            {
              id: 'rendering',
              src: renderingMachine,
              autoForward: true,
            },
          ],
          on: {
            STYLE_CONTAINER: {
              actions: 'styleContainer',
            },
          },
        },
      },
    },
    options
  )
}

export default createViewerMachine
