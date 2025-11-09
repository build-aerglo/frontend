<template>
    <div>
        <ul>
            <li>
                <NuxtLink to="/" class="text-blue-500">End-User Landing Page</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/auth/support-user/sign-up" class="text-blue-500">Register as Support User</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/profile/end-user" class="text-blue-500">End-User Profile</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/profile/business-profile-user-pov" class="text-blue-500">Business Profile</NuxtLink>
            </li>
        </ul>
    </div>


    <div class="flex gap-[10px] p-4">

        <NuxtLink to="./business/auth/business/sign-in">Business Registration page</NuxtLink>
        <NuxtLink to="./business/auth/business/sign-up">Business Login page</NuxtLink>
        <NuxtLink to="./business/settings">Business Settings page</NuxtLink>
        <NuxtLink to="./business/profile">Business Profile page</NuxtLink>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false
});


</script>