<script lang="ts">
  let { orders, handleUpdateOrder } = $props();
</script>

{#if orders.length > 0}
  <div class="orders-list">
    {#each orders as order}
      <div class="order-card">
        <h3>Order ID: {order.id}</h3>
        <h3>Status: {order.status}</h3>
        <h3>Items:</h3>
        <ul>
          {#each order.items as item}
            <li>{item.name}: {item.quantity}</li>
          {/each}
        </ul>
        {#if order.status === "Pending"}
          <button onclick={() => handleUpdateOrder(order.id)}>Process Order</button>
        {:else if order.status === "Received"}
          <button onclick={() => handleUpdateOrder(order.id)}>Complete Order</button>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <p>No orders available.</p>
{/if}

<style>
  h3 {
    margin-bottom: 0px;
  }
  ul {
    padding-left: 30px;
    margin-top: 5px;
  }
  .orders-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: stretch;
    gap: 10px;
  }
  .order-card {
    color: white;
    display: inline-grid;
    background-color: #5324aa;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    transition: box-shadow 0.2s;
    width: 262px;
  }
  button {
    color: white;
    border-radius: 8px;
    border: 3px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #3d3c3c;
    cursor: pointer;
    transition: border-color 0.25s;
    align-self: center;
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>
