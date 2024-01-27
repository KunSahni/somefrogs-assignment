import { AnimatePresence, motion } from 'framer-motion'
import { ErrorMessage } from '../Text'
import './style.scss'

interface InputFieldProps {
  label: string
  name: string
  type: 'text'
  value: any
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  required: boolean
  testId?: string
  desc?: string
  error?: string
}

export const InputField = (props: InputFieldProps) => {
  return (
    <AnimatePresence>
      <motion.div className="inputFieldContainer">
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
      </motion.div>
    </AnimatePresence>
  )
}
