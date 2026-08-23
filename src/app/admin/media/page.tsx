"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import { Card } from "@/components/ui/Card";

type Item = {
  id: string;
  name: string;
  url: string;
  path: string;
};

export default function MediaPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() =>
    onSnapshot(
      query(collection(db, "media"), orderBy("createdAt", "desc")),
      (s) => setItems(s.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        url: d.data().url,
        path: d.data().path,
      })))
    ),
    []
  );

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const path = `media/${Date.now()}-${file.name}`;
      const r = ref(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await addDoc(collection(db, "media"), {
        name: file.name,
        url,
        path,
        createdAt: serverTimestamp(),
      });
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function remove(item: Item) {
    await deleteObject(ref(storage, item.path)).catch(() => {});
    await deleteDoc(doc(db, "media", item.id));
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl text-ink-100 mb-1">Media</h1>
      <p className="text-ink-500 text-sm mb-6">Upload images for the website.</p>
      <Card className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={upload}
          disabled={busy}
          className="text-ink-200"
        />
      </Card>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative border border-ink-800 rounded overflow-hidden">
            <img src={item.url} alt={item.name} className="aspect-square object-cover w-full" />
            <button
              onClick={() => remove(item)}
              className="absolute top-2 right-2 bg-ink-950/80 text-rose text-xs px-2 py-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
