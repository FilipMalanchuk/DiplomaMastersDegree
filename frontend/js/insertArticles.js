export function insertArticles (articlesArr, target) {
    articlesArr.forEach(element => {
        let tags = "";
        element.articleTags.forEach(item => {
            let tagStr = `<span class="tag">${item}</span>`
            tags +=tagStr;
        })
        let text = "";
        let textSplitArr = element.articleText.split("\n");
        textSplitArr.forEach(item => {
            text+= `<p>${item}</p>`
        })
        let article = `<div class="article">
                    <div class="articleHeadline">${element.headline}</div>
                    <div class="articleImage"><img src="${element.imageUrl}" alt="${element.imageOriginalName}"></div>
                    <div class="articleText">${text}</div>
                    <span style="display: none;" class="articleID">${element._id}</span>
                    <div class="articleTags">${tags}</div>
                </div>`
        target.insertAdjacentHTML('beforeend',article);
    });
}