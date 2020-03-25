package code;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.sql.* ;  // for standard JDBC programs
import java.math.* ; // for BigDecimal and BigInteger support
import java.util.logging.Level;
import java.util.logging.Logger;


public class connection {


    public static void main(String[] args) {



        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));



        String url = "jdbc:postgresql://localhost:5432/dbproject";
        String user = "anthony";
        String password = "password";

        int id = 5;
        String author = "Amy Li";
        String query = "INSERT INTO authors(id, name) VALUES(?, ?)";

        try (Connection con = DriverManager.getConnection(url, user, password);
             PreparedStatement pst = con.prepareStatement(query)) {

            pst.setInt(1, id);
            pst.setString(2, author);
            pst.executeUpdate();

        } catch (SQLException ex) {

            Logger lgr = Logger.getLogger(connection.class.getName());
            lgr.log(Level.SEVERE, ex.getMessage(), ex);
        }
    }


}
