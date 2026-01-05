<template>
    <div>
        <ul>
            <li>
                <NuxtLink to="/" class="text-blue-500">End-User Landing Page</NuxtLink>
            </li>
            <li>
                <NuxtLink to="./support/auth/sign-in" class="text-blue-500">Support User Login</NuxtLink>
            </li>
            <li>
                <NuxtLink to="./support/user/dashboard" class="text-blue-500">Support User Dashboard</NuxtLink>
            </li>
            <li>
                <NuxtLink to="./user/id/5d180e47-d405-4cc2-a251-ca5900de997c" class="text-blue-500">End-User Profile</NuxtLink>
            </li>
            <li>
                <NuxtLink to="./end-user/profile/business" class="text-blue-500">Business Profile (End-User POV)
                </NuxtLink>
            </li>
        </ul>
    </div>


    <div class="flex gap-[10px] p-4">
        <NuxtLink to="./business/auth/sign-up">Business Registration page</NuxtLink>
        <NuxtLink to="./business/auth/sign-in">Business Login page</NuxtLink>
        <NuxtLink to="./business/dashboard">Business Dashboard</NuxtLink>
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
