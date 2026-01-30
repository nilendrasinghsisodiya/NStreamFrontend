"use client";
import { useState, useRef } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
export function OtpVerificationPage() {
  const [value, setValue] = useState<string>("");
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const handleComplete = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.focus();
    }
  };
  const handleConfirm = async () => {
    if (!value.trim()) console.error("invalid value");
    console.log(value);
  };
  return (
    <div className="space-y-2 flex flex-col w-2/3 h-2/3 gap-3 items-center justify-center border-grey shadow-xl border-3 rounded-2xl p-5 justify-self-center self-center m-auto my-10">
      <label htmlFor="InputOTP">{"Your One Time Password"}</label>
      <InputOTP
        id="InputOTP"
        pattern={REGEXP_ONLY_DIGITS}
        maxLength={6}
        value={value}
        className="w-full h-full flex justify-center"
        onComplete={handleComplete}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div>
        <button
          className={
            "inline-flex items-centerm w-fit p-2 h-fit px-5  justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
          }
          ref={btnRef}
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
