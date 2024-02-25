<template>
    <nav>
        <ul>
            <li v-for="page in pages" :key="page">
                <a :href="`?page=${page}`" :class="{ current: page === currentPage }">{{ page }}</a>
            </li>
        </ul>
    </nav>
</template>
  
<script>
export default {
    name: 'Pagination',
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        }
    },
    computed: {
        pages() {
            // create an array of pages
            const pages = [];
            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }
    }
};
</script>
  
<style>
nav {
    text-align: center;
}

ul {
    display: inline-block;
    margin: 0;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 8px;
}

a {
    display: inline-block;
    padding: 8px 16px;
    color: #333;
    text-decoration: none;
}

a.current {
    font-weight: bold;
    color: #000;
}
</style>
  