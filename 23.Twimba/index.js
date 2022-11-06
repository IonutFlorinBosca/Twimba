import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.querySelector('main').oncontextmenu = (e) => {
  e.preventDefault()
  if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like)
       addTrashTweetOption() 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
        addTrashTweetOption()
    }
    else if(e.target.dataset.reply){
        handleReplyModal(e.target)
        document.getElementById('btn-send-reply').addEventListener('click', function(){
            handleSendReplyBtnClick(e.target.dataset.reply)
        })
        handleReplyCloseBtn()
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})

function handleSendReplyBtnClick(idOfClickedIcon){
    const replyInput = document.getElementById('inner-modal-textarea')
    let currentReply = tweetsData.filter(function(tweet){
        return tweet.uuid === idOfClickedIcon
    })[0]
    if(replyInput.value){
        currentReply.replies.unshift({
            handle: `@Johnny ✅`,
            profilePic: `images/Ion.png`,
            tweetText: replyInput.value
        })
    render()
    addTrashTweetOption()
    replyInput.value = ''
    document.querySelector('.btn-send-reply').replaceWith(document.querySelector('.btn-send-reply').cloneNode(true))
    }
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleReplyModal(replyTarget){
    if(!replyTarget.classList.contains('displayOn')){
        document.getElementById('modal').classList.add('displayOn')
    }
}

function handleReplyCloseBtn(){
    document.getElementById('btn-close-modal').addEventListener('click', function(){
        document.getElementById('modal').classList.remove('displayOn')
    })
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })   
    render()
    tweetInput.value = ''
    addTrashTweetOption()
    }

}

function trashTweet(){
    tweetsData.shift()
    render()
}

function addTrashTweetOption(){
    let isOwnTweet = false
    tweetsData.forEach(function(tweet){
        if(tweet.handle === "@Scrimba"){
            isOwnTweet = true
        }
    })
    if(isOwnTweet){
        document.querySelector('.tweet-details').innerHTML += `
            <span class="tweet-detail" id="trash-tweet">
                <i class="fa-solid fa-trash"
                data-trash="${uuidv4()}"
                ></i>
            </span>
        `
        isOwnTweet = !isOwnTweet
    }
    document.getElementById('trash-tweet').addEventListener('click', trashTweet)
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
            
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
                 
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

