<template>
    <div>
        <ul>
            <li>
                <NuxtLink to="/" class="text-blue-500">End-User Landing Page</NuxtLink>
            </li>
            <li>
                <NuxtLink to="./support/auth/sign-up" class="text-blue-500">Register as Support User</NuxtLink>
            </li>
            <li>
                <NuxtLink to="./end-user/profile/end-user" class="text-blue-500">End-User Profile</NuxtLink>
            </li>
            <li>
                <NuxtLink to="./end-user/profile/business" class="text-blue-500">Business Profile (End-User POV)
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="./end-user/landing/explore" class="text-blue-500">Explore Page</NuxtLink>
            </li>
        </ul>
    </div>


    <div class="flex gap-[10px] p-4">
        <NuxtLink to="./business/auth/sign-up">Business Registration page</NuxtLink>
        <NuxtLink to="./business/auth/sign-in">Business Login page</NuxtLink>
        <NuxtLink to="./business/settings">Business Settings page</NuxtLink>
        <NuxtLink to="./business/profiles/">Business Profile page</NuxtLink>
        <NuxtLink to="./business/[id]">Unclaimed Business</NuxtLink>
    </div>

    <div>
        <NuxtLink to="/biz/e4c33f90-6136-46fe-b1f2-56b032331b91/">New Profile Page</NuxtLink>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false
});


</script>
