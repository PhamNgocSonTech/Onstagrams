export const getListSrcFromAllPosts = (listPost = []) => {
    let img = [];
    let video = [];
    listPost.forEach((item) => {
        item.img.forEach((image) => {
            img.push(image.url);
        });
        item.video.forEach((item) => {
            video.push(item.url);
        });
    });
    return {
        img,
        video,
    };
};
