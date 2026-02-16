"use client";
import { useState, useRef } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="flex container h-full items-center justify-center p-5  ">
      <Card className=" w-full flex gap-5 py-35 justify-center items-center h-fit m-auto">
        <label htmlFor="InputOTP" className="text-xl sm:text-2xl ">
          Your One Time Password
        </label>
        <InputOTP
          id="InputOTP"
          pattern={REGEXP_ONLY_DIGITS}
          maxLength={6}
          value={value}
          className="w-full h-full flex justify-center outline-3 outline-blue-500 "
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
          <Button tabIndex={0} ref={btnRef} onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </Card>
    </div>
  );
}
