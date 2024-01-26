import { AnimatePresence, motion } from 'framer-motion'
import { IconButton } from '../Button'
import { ErrorMessage } from '../Text'
import './style.scss'

interface InputFieldProps {
  label: string
  name: string
  type: 'number' | 'datetime-local'
  value: any
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  required: boolean
  stepper?: {
    step: number
    decrementDesc: string
    incrementDesc: string
  }
  testId?: string
  desc?: string
  error?: string
  style?: React.CSSProperties
}

export const InputField = (props: InputFieldProps) => {
  return (
    <AnimatePresence>
      <motion.div className="inputFieldContainer" style={props.style}>
        {props.desc && (
          <span id={'description-' + props.name} className="sr-only">
            {props.desc}
          </span>
        )}
        <label id={'label-' + props.name} className="inputFieldLabel" htmlFor={'input-' + props.name}>
          {props.label}
        </label>
        <input
          id={'input-' + props.name}
          data-test-id={props.testId}
          className={'inputField' + (props.error && props.value !== '' && props.value !== undefined ? 'Invalid' : '')}
          style={{
            textAlign: props.stepper ? 'center' : 'left'
          }}
          type={props.type}
          name={props.name}
          value={props.value}
          required={props.required}
          onChange={props.onChange}
          aria-invalid={props.error && props.value !== '' && props.value !== undefined ? true : false}
          aria-labelledby={'label-' + props.name}
          aria-describedby={
            'description-' +
            props.name +
            (props.error && props.value !== '' && props.value !== undefined ? ' error-' + props.name : '')
          }
        />
        {props.error && (
          <motion.div
            className="inputFieldError"
            initial={{ transform: 'scale(0)' }}
            animate={{ transform: 'scale(1)' }}
            exit={{ transform: 'scale(0)' }}
          >
            <ErrorMessage key={props.name + 'error'} id={'error-' + props.name}>
              {props.error}
            </ErrorMessage>
          </motion.div>
        )}
        {props.stepper && (
          <>
            <span id={'description-' + props.name + '-stepper-decrement'} className="sr-only">
              {props.stepper.decrementDesc}
            </span>
            <IconButton
              data-test-id={'button-' + props.name + '-stepper-decrement'}
              className="inputFieldButtonLeft"
              onClick={() => props.onChange({ target: { value: props.value - props.stepper!.step } } as any)}
              disabled={props.value <= 0}
              aria-disabled={props.value <= 0}
              aria-describedby={'description-' + props.name + '-stepper-decrement'}
            >
              -
            </IconButton>
            <span id={'description-' + props.name + '-stepper-increment'} className="sr-only">
              {props.stepper.incrementDesc}
            </span>
            <IconButton
              data-test-id={'button-' + props.name + '-stepper-increment'}
              className="inputFieldButtonRight"
              onClick={() =>
                props.onChange({
                  target: { value: props.value ? props.value + props.stepper!.step : props.stepper!.step }
                } as any)
              }
              aria-describedby={'description-' + props.name + '-stepper-increment'}
            >
              +
            </IconButton>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
