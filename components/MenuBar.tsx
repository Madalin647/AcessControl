import { PropsWithChildren } from "react";


export default function MenuBar(props:PropsWithChildren) {

  const {children} = props
  return (
    <section className="menu-bar">
    {children}
    </section>
  )
}
