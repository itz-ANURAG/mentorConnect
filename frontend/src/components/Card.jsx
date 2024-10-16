import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";

export function BookingCard() {
    return (
        <Card className="flex flex-row w-full max-w-[26rem] shadow-lg items-center rounded-lg mb-4">
            <CardHeader floated={false} className="w-1/4 p-2">
                <img
                    src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="ui/ux review check"
                    className="w-16 h-16 rounded-full"
                />
            </CardHeader>
            <CardBody className="flex flex-col justify-between p-2 w-3/4">
                <div className="flex items-center justify-between">
                    <Typography variant="h6" color="blue-gray" className="font-medium">
                        Fiodar Sazanavets
                    </Typography>
                    <Typography color="blue-gray" className="flex items-center gap-1.5 font-normal">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5 text-yellow-700"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                            />
                        </svg>
                        5.0
                    </Typography>
                </div>
                <Typography color="gray" className="text-sm mt-1">
                    Senior Software Engineer at Microsoft
                </Typography>
                <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs">C#</span>
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs">.NET</span>
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs">ASP.NET Core</span>
                </div>
            </CardBody>
        </Card>
    );
}
