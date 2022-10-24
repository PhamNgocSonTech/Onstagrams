/**
 * layout == null => <></>
 * layout == undefined => DefaultLayout
 * layout == abc => <abc></abc>
 */
export const pubRoutes = [
  {
    path: "/",
    element: "Home",
  },
  {
    path: "/following",
    element: "Follow",
  },
  {
    path: "/feedback",
    element: "Feedback",
    layout: "OnlyHeader",
  },
  {
    path: "/upload",
    element: "Upload",
    layout: "null",
  },
];
