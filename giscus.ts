import giscus from '@giscus/vue';
import { createApp, h, nextTick, onMounted, Ref, watch } from 'vue';
import { PageData, useRoute } from 'vitepress';
import { GiscusProps } from '@giscus/vue/dist/types';

/**
 * 添加评论容器
 * @param props 配置
 * @param frontmatter 前言
 */
const setGiscus = (props?: GiscusProps, frontmatter?: Ref<PageData['frontmatter']>) => {
    const defaultProps: GiscusProps = {
        id: 'comment',
        host: 'https://giscus.app',
        repo: null,
        repoId: null,
        category: 'General',
        categoryId: null,
        mapping: 'pathname',
        term: 'Welcome to giscus!',
        reactionsEnabled: '1',
        inputPosition: 'top',
        lang: 'zh-CN',
        loading: 'lazy'
    };
    // 删除原有评论容器
    let oldCommentContainer = document.getElementById('giscus');
    if (oldCommentContainer) {
        oldCommentContainer.parentNode.removeChild(oldCommentContainer);
    }
    // 如果 comment 为 false，则不加载评论
    if (!!frontmatter?.value && (frontmatter?.value.comment !== undefined && !frontmatter?.value.comment)) {
        return;
    }
    // 如果是首页，则不添加
    if (!location.pathname || location.pathname === '/') {
        return;
    }
    const dark: boolean = !!document.querySelector('html').className;
    // 获取父容器，并创建评论容器
    const docContent = document.getElementsByClassName('content-container')[0];
    if (docContent) {
        const bindGiscus = document.createElement('div');
        // 设置评论容器的属性及样式
        bindGiscus.setAttribute('id', 'giscus');
        bindGiscus.style.height = 'auto';
        bindGiscus.style.marginTop = '40px';
        bindGiscus.style.borderTop = '1px solid var(--vp-c-divider)';
        bindGiscus.style.paddingTop = '20px';
        // 芙蓉其尾部添加评论容器
        docContent.append(bindGiscus);
        // 使用vue动态创建评论组件并绑定到相应元素上
        createApp({
            render: () => {
                return h(
                    giscus, { ...defaultProps, theme: dark ? 'transparent_dark' : 'light', ...props }
                );
            }
        }).mount('#giscus');
    }
};

/**
 * 监听页面主题，更改评论容器的主题
 */
const setThemeWatch = () => {
    const element = document.querySelector('html');
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type == 'attributes') {
                let comment: Element = document.getElementById('comment');
                comment?.setAttribute('theme', element.className.indexOf('dark') !== -1 ? 'transparent_dark' : 'light');
            }
        });
    });
    observer.observe(element, {
        attributeFilter: [ 'class' ]
    });
};

const giscusTalk = (frontmatter: Ref<PageData['frontmatter']>, props: GiscusProps) => {
    const route = useRoute();
    onMounted(() => {
        setGiscus(props, frontmatter);
        setThemeWatch();
    });
    watch(() => route.path, () => nextTick(() => {
        setGiscus(props, frontmatter);
    }));
};

export default giscusTalk;
