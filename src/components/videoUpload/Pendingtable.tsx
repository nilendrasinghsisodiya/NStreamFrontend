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

export const PendingUploadsTable = () => {
	const { uploads } = useSelector(selectVideoUpload);
	const pendingUploads: IUpload[] = uploads.map((ele) => {
		if (ele.state === "pending") return ele;
	}) as IUpload[];
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-2/3">Title</TableHead>
					<TableHead>State</TableHead>
					<TableHead>Progress</TableHead>
					<TableHead className="text-right">Option</TableHead>
				</TableRow>
			</TableHeader>

			{pendingUploads.length > 0 ? (
				<TableBody>
					{pendingUploads.map((ele) => (
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
