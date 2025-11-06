<template>
    <div>
        <ul>
             <li>
                <NuxtLink to="/landing/end-user/home" class="text-blue-500">End-User Landing Page</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/auth/support-user/sign-up" class="text-blue-500">Register as Support User</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/review/signed-in" class="text-blue-500">Logged-in user write a review page</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/profile/end-user" class="text-blue-500">End-User Profile</NuxtLink>
            </li>
        </ul>
    </div> 
    
    
    <div class="flex gap-[10px] p-4">
        <p>Home</p>
        <NuxtLink to="./auth/business/register">Business Registration page</NuxtLink>
        <NuxtLink to="./auth/business/login">Business Login page</NuxtLink>
        <NuxtLink to="./auth/business/settings">Business Settings page</NuxtLink>
        <NuxtLink to="./auth/business/profile">Business Profile page</NuxtLink>
    </div>
</template>

<script setup>
definePageMeta({
  layout: false 
});


</script>