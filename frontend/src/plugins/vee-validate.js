import { extend, localize } from 'vee-validate'
import { required, email, min } from 'vee-validate/dist/rules'
import ru from 'vee-validate/dist/locale/ru.json'

// Install rules
extend('required', required)
extend('email', email)
extend('min', min)

// Install messages
localize('ru', {
  messages: {
    ...ru.messages,
    required: 'Поле обязательно для заполнения'
  }
})
