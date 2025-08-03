import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IUpload,
  selectVideoUpload,
} from "@/contexts/videoUpload/videoUploadSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const SuccessfullUploadsTable = () => {
  const [successfullUploads, setSuccessFullUploads] = useState<IUpload[] | []>(
    []
  );
  const { uploads } = useSelector(selectVideoUpload);
  useEffect(() => {
    const fetchedUploads = uploads.map((ele) => {
      if (ele.state === "success") return ele;
    }) as IUpload[];
    setSuccessFullUploads(fetchedUploads);
  }, [uploads, setSuccessFullUploads]);
  return (
    <Table className="w-full h-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-2/3">Title</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead className="text-right">Option</TableHead>
        </TableRow>
      </TableHeader>
      {successfullUploads.length > 0 ? (
        <TableBody>
          {successfullUploads.map((ele) => (
            <TableRow key={ele.title}>
              <TableCell className="font-medium w-2/3">{ele.title}</TableCell>
              <TableCell>{ele.state}</TableCell>
              <TableCell>{ele.progress}</TableCell>
              <TableCell className="text-right">{100}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody>
          <TableRow>
            <TableCell>no uploads yet</TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  );
};
