export default function FormTitle({ text }: { text: string }) {
  return (
    <h2 className="text-2xl font-bold text-black text-center md:text-left">
      {text}
    </h2>
  );
}
