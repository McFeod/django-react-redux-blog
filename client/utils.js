export const ROOT_KEY = 'root';

function getArticleId() {
    let parts = window.location.href.split('/');
    return parts.pop() || parts.pop();
}


function getResourceUrl(params){
    params['article'] = getArticleId();
    params['limit'] = 0;
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

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export {getResourceUrl, makeRelations, getArticleId, getCookie}