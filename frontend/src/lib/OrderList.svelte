<script lang="ts">
  import { flip } from 'svelte/animate'
  import { send, receive } from './transition.js';

  let { orders, handleUpdateOrder } = $props();
</script>

{#if orders.length > 0}
  <div class="orders-list">
    {#each orders as order (order.id)}
      <div
        class="order-card"
        style:background-color={order.status === 'Pending' ? '#605d66' : 
        order.status === 'Received' ? '#e676bb' : '#278f5e'}
        in:receive={{ key: order.id }}
			  out:send={{ key: order.id }}
        animate:flip={{ duration: 200 }}
      >
        <h3>Order ID: {order.id}</h3>
        <h3>Status: {order.status}</h3>
        <h3>Items:</h3>
        <li>
          {order.items.name} x {order.items.quantity}
        </li>
        {#if order.status === "Pending"}
          <button onclick={() => handleUpdateOrder(order.id, "Received")}
            >Process Order</button>

        {:else if order.status === "Received"}
          <button onclick={() => handleUpdateOrder(order.id, "Completed")}
            >Complete Order</button>
          
        {:else if order.status === "Completed"}
            <button onclick={() => handleUpdateOrder(order.id, "Received")}
            >Process Order</button>

        {/if}
      </div>
    {/each}
  </div>
{:else}
  <p>No orders available.</p>
{/if}

<style>
  h3 {
    font-size: 1.25em;
    font-weight: 500;
    margin-top: 10px;
    margin-bottom: 0px;
  }

  p {
    font-size: 1.5em;
    margin-top: 0px;
  }

  li {
    font-size: 1.2em;
    font-weight: 400;
    padding-top: 5px;
    padding-bottom: 15px;
    padding-left: 15px;
  }

  .orders-list {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: stretch;
    justify-content: start;
    gap: 10px;
  }

  .order-card {
    color: white;
    opacity: 0.85;
    display: inline-grid;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    transition: box-shadow 0.2s;
    width: 22.195%;
  }

  button {
    color: white;
    border-radius: 8px;
    border: 3px solid transparent;
    padding: 0.6em 1em;
    font-size: 1.2em;
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
