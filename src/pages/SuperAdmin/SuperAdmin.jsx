import AddAdminForm from "../../components/AddAdminForm/AddAdminForm";
import AddModeratorForm from "../../components/AddModeratorForm/AddModeratorForm";
import DeleteLombardForm from "../../components/DeleteLombardForm/DeleteLombardForm";

export default function SuperAdmin() {
  return (
    <>
      <AddModeratorForm />
      <AddAdminForm />
      <DeleteLombardForm />
    </>
  );
}
