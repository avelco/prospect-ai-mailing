<script>
	let count = $state(0);
</script>

<div class="bg-base-200 flex h-screen items-center justify-center">
	<div class="hero bg-base-100 rounded-xl p-10 text-center shadow-lg">
		<button class="btn btn-primary" onclick={() => count++}>
			Count: {count}
		</button>
	</div>
</div>
