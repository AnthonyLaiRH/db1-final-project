package cli;

import java.io.BufferedReader;
import java.io.Console;
import java.io.InputStreamReader;

import java.sql.* ;  // for standard JDBC programs
import java.math.* ; // for BigDecimal and BigInteger support
import java.util.logging.Level;
import java.util.logging.Logger;

public class SQL_CLI {

    BufferedReader br;
    Console console;
    private boolean active;

    private Connection connection;
    private String url;
    private String user;
    private String password;


    public SQL_CLI() {
       this.br = new BufferedReader(new InputStreamReader(System.in));
       this.console = System.console();
       this.active = true;
       //this.url = "jdbc:postgresql://localhost:5432/dbproject";
       //this.user = "anthony";
       //this.password = "password";

       System.out.println("\n\n\n>>>>>>>>>>>>>>   Property Rental SQL Command Line Interface   <<<<<<<<<<<<<<\n\n");
    }

    public boolean isActive() {
        return active;
    }

    public void run(){
        getDBInfo();
        while (this.isActive()){
            System.out.print(" >> ");
            readCommand();
        }
        dispose();
    }

    private void dispose(){
        try{
            this.connection.close();
        } catch (Exception e){

        } finally {
            System.out.println(" >> exit");
        }
    }

    private void getDBInfo(){
        boolean completed = false;
        do {
            System.out.print("\n >> Enter the name of the database to connect to: ");
            String url = "jdbc:postgresql://localhost:5432/" + this.console.readLine().trim();
            System.out.print("\n >> Enter user name: ");
            String user = this.console.readLine().trim();
            System.out.print("\n >> Enter password: ");
            char[] password = this.console.readPassword();

            try {
                this.connection = DriverManager.getConnection(url, user, String.copyValueOf(password));

                completed = true;

                this.url = url;
                this.user = user;
                this.password = String.copyValueOf(password);

            } catch (SQLException e) {

                System.out.println("\n >> Connection failed. ");
                e.printStackTrace();
                System.out.print(" >> Retry? (Y/N)");
                String retry = this.console.readLine().trim().toLowerCase();
                if (retry.equals("n")) {
                    completed = true;
                    this.active = false;
                }
            }
        }while (!completed);
    }
    public void readCommand (){

    }

    public static void main(String[] args){

        SQL_CLI program = new SQL_CLI();
        program.run();

    }
}
