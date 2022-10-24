import OnlyHeader from "../Default/Layout/OnlyHeader";
import Feedback from "../pages/Feedback";
import Follow from "../pages/Follow";
import Home from "../pages/Home";
import Upload from "../pages/Upload";

export const pubRoutes = [
    {
        path: "/",
        element: Home
    },
    {
        path: "/following",
        element: Follow
    },
    {
        path: "/feedback",
        element: Feedback,
        layout: OnlyHeader
    },
    {
        path: "/upload",
        element: Upload,
        layout: null
    }
];
