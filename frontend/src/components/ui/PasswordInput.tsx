import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/Input";

interface PasswordInputProps extends Omit<InputProps, "type"> {
  type?: "password" | "text";
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false);
    const { type: _type, rightSlot, ...rest } = props;

    return (
      <Input
        ref={ref}
        {...rest}
        type={visible ? "text" : "password"}
        rightSlot={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((value) => !value)}
            className="cursor-pointer p-1.5 text-ink/40 transition-colors hover:text-ink dark:text-white/40 dark:hover:text-white"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
      />
    );
  },
);
