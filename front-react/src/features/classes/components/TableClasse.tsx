import { useQuery } from "@tanstack/react-query";
import * as ClasseService from "../services/classe.service";

// interface Props {}

function TableClasse() {
  const classes = useQuery({
    queryKey: ["classes"],
    queryFn: ClasseService.getAllClasses,
  });

  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
          </tr>
        </thead>
        <tbody>
          {classes.data?.map((classe) => (
            <tr>
              <td>{classe.id}</td>
              <td>{classe.nom}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th>Name</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TableClasse;
