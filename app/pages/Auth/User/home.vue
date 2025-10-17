<template>
    <header class="py-4 border-b">
        <nav class="flex container items-center">
            <a href="" classs="flex gap-1 items-center">
                <div class="text-3xl font-bold text-primary ml-8">EchoHub</div>
            </a>
            <ul class="flex gap-6 ml-auto text-xl capitalize">
                <li>
                    <NuxtLink to="/loginuser">
                         <Button label="Log In" class="w-full bg-primary hover:opacity-10;text-light;bg-gray-400"/>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/">
                         <Button label="Sign Up" class="w-full bg-primary hover:opacity-10;text-light"/>
                    </NuxtLink>
                </li>
                
            </ul>
        </nav>
    </header>
    <body class="bg-gray-200 h-screen flex items-center justify-center">
        <div class="relative">
            <svg class="h-10 w-10 absolute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input type="text"/>
        </div>
    </body>
</template>