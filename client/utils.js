export const ROOT_KEY = 'root';

function getResourceUrl(params){
    let parts = window.location.href.split('/');
    params['article'] = parts.pop() || parts.pop();
    return '/api/v1/comments/?' +
        Object.entries(params).map(
            ([key, value]) => key + '=' + value
        ).join('&');
}

function makeRelations(comments, root=ROOT_KEY) {
    let pairs = {};
    let children = {};
    for (let comment of comments){
        pairs[comment.id] = comment;
        let parent = comment.parent_comment || ROOT_KEY;
        if (children[parent] === undefined){
            children[parent] = [comment.id]
        } else {
            children[parent].push(comment.id)
        }
    }
    return {pairs, children}
}

export {getResourceUrl, makeRelations}