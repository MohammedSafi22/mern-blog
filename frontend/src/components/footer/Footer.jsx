import React from 'react'

const Footer = () => {
  return (
    <footer style={styles}>
        CopyRight 2023 &copy;
    </footer>
  )
}

const styles = {
    color: "var(--white-color)",
    fontsize: "21px",
    backgroundColor:"var(--blue-color)",
    display: "flex",
    justifyContent: "center",
    alignItems:"center",
    height:"50px"
}

export default Footer