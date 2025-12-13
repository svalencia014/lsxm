<script>
	import { goto } from "$app/navigation";
	import { env } from "$env/dynamic/public";

</script>
<div class="flex h-screen items-center justify-center">
  <div class="relative w-full max-w-sm rounded-lg border border-gray-300 bg-white p-8 shadow-lg">
    <button onclick={() => {
      window.location.href = `https://last.fm/api/auth?api_key=${env.PUBLIC_API_KEY}&cb=${env.PUBLIC_BASE_URL}/login/callback`;
    }}>Login with last.fm</button>
  </div>
</div>