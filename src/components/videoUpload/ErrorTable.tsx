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
import { useSelector } from "react-redux";

export const ErrorUploadsTable = () => {
	const { uploads } = useSelector(selectVideoUpload);
	const errorUploads: IUpload[] = uploads.map((ele) => {
		if (ele.state === "error") return ele;
	}) as IUpload[];
	return (
		<Table className="  ">
			<TableHeader>
				<TableRow>
					<TableHead className="w-2/3">Title</TableHead>
					<TableHead>State</TableHead>
					<TableHead>Progress</TableHead>
					<TableHead className="text-right">Option</TableHead>
				</TableRow>
			</TableHeader>
			{errorUploads.length > 0 ? (
				<TableBody className="h-full w-full ">
					{errorUploads.map((ele) => (
						<TableRow key={ele.id}>
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
						<TableCell className="text-center text-2xl p-10">
							no uploads yet
						</TableCell>
					</TableRow>
				</TableBody>
			)}
		</Table>
	);
};
