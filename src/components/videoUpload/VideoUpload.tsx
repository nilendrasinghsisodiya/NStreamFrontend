import { useState } from "react";
import { Button } from "../ui/button";
import { ErrorUploadsTable } from "./ErrorTable";
import { PendingUploadsTable } from "./Pendingtable";
import { SuccessfullUploadsTable } from "./SuccessfullTable";
import { Separator } from "../ui/separator";

export const VideoUploadsList = ({ className }: { className: string }) => {
  const [errorTab, setErrorTab] = useState<boolean>(false);
  const [pendingTab, setPendingTab] = useState<boolean>(true);
  const [successTab, setSuccessTab] = useState<boolean>(false);
  return (
    <div className={className}>
      <div className="flex justify-center w-full gap-3 p-3  min-h-12 overflow-scroll">
        <Button
          className="bg-foreground text-backgroundbg-foreground text-background aria-checked:bg-accent aria-checked:text-foreground  border-2 aria-checked:border-foreground/50 "
          aria-checked={pendingTab}
          onClick={() => {
            setErrorTab(false);
            setPendingTab(true);
            setSuccessTab(false);
          }}
        >
          Pending
        </Button>
        <Button
          className="bg-foreground text-background aria-checked:bg-accent aria-checked:text-foreground  border-2 aria-checked:border-foreground/50 "
          aria-checked={errorTab}
          onClick={() => {
            setErrorTab(true);
            setPendingTab(false);
            setSuccessTab(false);
          }}
        >
          Error
        </Button>
        <Button
          className="bg-foreground text-background aria-checked:bg-accent aria-checked:text-foreground  border-2 aria-checked:border-foreground/50"
          aria-checked={successTab}
          onClick={() => {
            setErrorTab(false);
            setPendingTab(false);
            setSuccessTab(true);
          }}
        >
          Successfull
        </Button>
      </div>
      <Separator className=" m-1" />
      <div className="w-full min-h-full">
        {/* tables here */}
        {(errorTab && <ErrorUploadsTable />) ||
          (pendingTab && <PendingUploadsTable />) ||
          (successTab && <SuccessfullUploadsTable />)}
      </div>
    </div>
  );
};
