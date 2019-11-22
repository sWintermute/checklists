import { extend, localize } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import ru from "vee-validate/dist/locale/ru.json";

// Install rules
extend("required", required);

// Install messages
localize("ru", {
    messages: {
        ...ru.messages,
        required: "Ответьте на вопрос"
    }
});
