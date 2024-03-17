"use client"

import { useMutation, useQuery } from 'convex/react';
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";
import { api } from "../../convex/_generated/api";


export default function Home() {
  const [text, setText] = useState('');
  const createTodo = useMutation(api.todos.createTodo);
  const todos = useQuery(api.todos.getTodos);

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <div className="flex flex-col gap-4">
          {todos?.map((todo) => {
            return <div key={todo._id}>{todo.text}</div>
          })}
        </div>
        <form 
          onSubmit={e => {
            e.preventDefault();
            // TODO: call mutation here
            createTodo({
              text,
            });
          }}
        >
          <input 
            value={text} 
            onChange={e => setText(e.target.value)} 
            className="text-black"
          />
          <button>Create</button>
        </form>
      </div>
    </main>
  );
}
