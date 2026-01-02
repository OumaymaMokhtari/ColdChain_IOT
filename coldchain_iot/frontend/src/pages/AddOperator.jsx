function AddOperator() {
    const [form, setForm] = useState({
      username: "",
      email: "",
      password: "",
      confirm_password: ""
    });
  
    const submit = () => {
      api.post("operators/", form)
        .then(() => alert("Opérateur ajouté"));
    };
  
    return (
      <>
        <input placeholder="Username" />
        <input placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm password" />
        <button onClick={submit}>Créer</button>
      </>
    );
  }
  