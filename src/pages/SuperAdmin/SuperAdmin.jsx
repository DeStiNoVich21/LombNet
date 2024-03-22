import AddAdminForm from "../../components/AddAdminForm/AddAdminForm";
import AddModeratorForm from "../../components/AddModeratorForm/AddModeratorForm";
import DeleteLombardForm from "../../components/DeleteLombardForm/DeleteLombardForm";
import Header from "../../components/Header/Header";

export default function SuperAdmin() {
  return (
    <>
      <Header />
      <AddModeratorForm />
      <AddAdminForm />
      <DeleteLombardForm />
    </>
  );
}
