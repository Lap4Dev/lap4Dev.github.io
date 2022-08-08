import bridge from '@vkontakte/vk-bridge';

bridge.send("VKWebAppInit", {});
bridge.subscribe((e) => console.log(e)); 