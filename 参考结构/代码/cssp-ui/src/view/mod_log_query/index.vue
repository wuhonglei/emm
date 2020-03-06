<template>
    <router-view />
</template>

<script>

/**
 * 日志检索模块入口 
 */

export default {
    beforeRouteEnter (to, from, next) {
        let query = to.query;
        if (query.product && query.type) {
            next({
                path: `/log/${query.product}/${query.type === 'invasion' ? 'safe' : query.type}`,
                query: Object.keys(query).filter(
                    key => key !== 'product'
                ).reduce((q, key) => {
                    q[key] = query[key];
                    return q;
                }, {})
            });
        }
 
        next();
    }
};
</script>
