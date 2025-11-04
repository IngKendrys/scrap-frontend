export default function button(props) {
  return (
    <button className={`bg-${props.color} p-2 rounded font-bold text-white`} >{props.text}</button>
  );
}