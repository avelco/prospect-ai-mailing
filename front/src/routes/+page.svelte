<script>
    let count = $state(0);
  </script>
  
  <div class="flex items-center justify-center h-screen bg-base-200">
    <div class="hero bg-base-100 p-10 rounded-xl shadow-lg text-center">

      <button class="btn btn-primary" onclick={() => count++}>
        Count: {count}
      </button>
    </div>
  </div>
  