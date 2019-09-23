import { extend, localize } from "vee-validate";
import { min, required, email } from "vee-validate/dist/rules";
import ru from "vee-validate/dist/locale/ru.json";

// Install rules
extend("required", required);
extend("min", min);
extend("email", email);

// Install messages
localize({
    ru
});
