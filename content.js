const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      chrome.storage.local.get(['savedAvatarUrl', 'savedAvatarSize'], (data) => {
        const savedAvatarUrl = data.savedAvatarUrl;
        const savedAvatarSize = data.savedAvatarSize || 72; // 设置默认值
        changeAvatar(mutation.target, savedAvatarUrl, savedAvatarSize);
      });
    }
  });
});

function changeAvatar(node, newAvatarUrl,newSize) {
  const avatarContainers = node.querySelectorAll('div[style="background-color: black;"], div[style="background-color: rgb(16, 163, 127);"]');
  avatarContainers.forEach((container) => {
      
      // 删除现有的SVG
      container.innerHTML = '';

      // 创建新的图像元素
      const img = document.createElement('img');
      img.src = newAvatarUrl || chrome.runtime.getURL('default_avatar.png');
      
      img.style.width = newSize + 'px';
      img.style.height = newSize + 'px';
      img.style.objectFit = 'cover'; // 使图像保持原始比例
      img.classList.add('replaced-avatar');
      container.classList.add('replaced-container');
      
      // 将新的图像元素添加到容器中
      container.appendChild(img);

      // 调整容器大小
      container.style.width = newSize + 'px';
      container.style.height = newSize + 'px';

  });
}

function changeAllAvatars(newAvatarUrl) {
  const avatars = document.body.querySelectorAll('.replaced-avatar').forEach((avatar) => {
    avatar.src = newAvatarUrl;
  });
}
function changeAllAvatarSize(newSize) {
  const avatars = document.body.querySelectorAll('.replaced-container').forEach((container) => {
      container.style.width = newSize + 'px';
      container.style.height = newSize + 'px';
  });
  const avatarContainers = document.body.querySelectorAll('.replaced-avatar').forEach((avatar) => {
      avatar.style.width = newSize + 'px';
      avatar.style.height = newSize + 'px';
  });
}

// 监听DOM变化以查找并替换新头像
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'changeAvatar' && request.imageUrl) {
    console.log('Received message:', request);
    changeAllAvatars(request.imageUrl);
  }else if (request.type === 'changeAvatarSize' && request.size) {
    changeAllAvatarSize(request.size);
  }
});

console.log('Content script loaded');
