export const ROOT_KEY = 'root';

function getParent(comment) {
    return comment.parent_comment ? comment.parent_comment : ROOT_KEY;
}

function getResourceUrl(params){
    let parts = window.location.href.split('/');
    params['article'] = parts.pop() || parts.pop();
    return '/api/v1/comments/?' +
        Object.entries(params).map(
            ([key, value]) => key + '=' + value
        ).join('&');
}

function makeTree(root, comments) {
    let tree = Object();
    tree[root] = Object();
    for (let comment of comments){
        tree[comment.id] = comment
    }
    for (let comment of comments){
        let parent = getParent(comment);
        if (tree[parent].children === undefined){
            tree[parent].children = [comment]
        } else {
            tree[parent].children.push(comment)
        }
    }
    return tree
}

export {getResourceUrl, makeTree, getParent}