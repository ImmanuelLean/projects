// ============================================
// FORMS, SERVER ACTIONS & MUTATIONS
// ============================================

const serverActionForms = `
// ===== Server Action with validation (Zod) =====

// app/actions/posts.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  published: z.boolean().default(false),
});

type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function createPost(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { message: 'Unauthorized' };

  const parsed = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'on',
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const post = await prisma.post.create({
      data: {
        ...parsed.data,
        slug: parsed.data.title.toLowerCase().replace(/\\s+/g, '-'),
        authorId: session.user.id,
      },
    });

    revalidatePath('/posts');
    redirect(\`/posts/\${post.slug}\`);
  } catch (error) {
    return { message: 'Failed to create post' };
  }
}

export async function deletePost(id: number): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { message: 'Unauthorized' };

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== session.user.id) {
    return { message: 'Not authorized' };
  }

  await prisma.post.delete({ where: { id } });
  revalidatePath('/posts');
  return { success: true, message: 'Post deleted' };
}
`;

const clientForm = `
// ===== Client form with useFormState =====

// components/CreatePostForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPost } from '@/app/actions/posts';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
    >
      {pending ? 'Publishing...' : 'Publish'}
    </button>
  );
}

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, {});

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state.message && (
        <div className="bg-red-50 text-red-600 p-3 rounded">{state.message}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {state.errors?.title && (
          <p className="text-red-500 text-sm mt-1">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          name="content"
          rows={8}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {state.errors?.content && (
          <p className="text-red-500 text-sm mt-1">{state.errors.content[0]}</p>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" className="rounded" />
        <span>Publish immediately</span>
      </label>

      <SubmitButton />
    </form>
  );
}
`;

const optimisticUpdates = `
// ===== Optimistic Updates with useOptimistic =====
'use client';
import { useOptimistic } from 'react';
import { toggleLike } from '@/app/actions';

function LikeButton({ postId, liked, count }: {
  postId: number; liked: boolean; count: number;
}) {
  const [optimistic, setOptimistic] = useOptimistic(
    { liked, count },
    (state, newLiked: boolean) => ({
      liked: newLiked,
      count: state.count + (newLiked ? 1 : -1),
    })
  );

  return (
    <form action={async () => {
      setOptimistic(!optimistic.liked);  // instant UI update
      await toggleLike(postId);           // server action
    }}>
      <button type="submit" className="flex items-center gap-1">
        <span>{optimistic.liked ? '❤️' : '🤍'}</span>
        <span>{optimistic.count}</span>
      </button>
    </form>
  );
}
`;

console.log("=== Next.js Forms & Mutations ===");
console.log("Server actions, Zod validation, useFormState, optimistic updates");

export {};
