package cli;

import util.DBTablePrinter;

import java.io.BufferedReader;
import java.io.Console;
import java.io.IOException;
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

        System.out.println("\n\nType 'h' or 'help' for help and list of commands. ");
        while (isActive()){
            readCommand();
        }
        dispose();
    }

    private void dispose(){
        try{
            this.connection.close();
        } catch (Exception e){

        } finally {
            System.out.println("DISCONNECTED");
        }
    }

    private void getDBInfo(){
        boolean completed = false;
        do {
            String url = "", user = "", password = "";
            try {
                System.out.print("\nEnter the port of the database on localhost: ");
                String port = this.br.readLine().trim();
                System.out.print("Enter the name of the database to connect to: ");
                //String url = "jdbc:postgresql://localhost:5432/" + this.console.readLine().trim();
                url = "jdbc:postgresql://localhost:" + port + "/" + this.br.readLine().trim();
                System.out.print("Enter user name: ");
                user = this.br.readLine().trim();
                //String user = this.br.readLine().trim();
                System.out.print("Enter password: ");
                //char[] password = this.console.readPassword();
                password = this.br.readLine().trim();
            }catch (IOException e){
                e.printStackTrace();
            }

            try {
                //this.connection = DriverManager.getConnection(url, user, String.copyValueOf(password));
                if (user.equals("") && password.equals("")) {
                    this.connection = DriverManager.getConnection(url);
                    this.url = url;
                    this.user = "user";
                    this.password = password;
                }else{
                    this.connection = DriverManager.getConnection(url, user, password);
                    this.url = url;
                    this.user = user;
                    this.password = password;
                }

                completed = true;

            } catch (SQLException e) {
                try {
                    e.printStackTrace();
                    System.out.println("\n >> Connection failed. ");
                    System.out.print(" >> Retry? (Y/N) ");
                    String retry = this.br.readLine().trim().toLowerCase();
                    if (retry.equals("n")) {
                        completed = true;
                        this.active = false;
                    }
                }catch (IOException ioe){
                    ioe.printStackTrace();
                }
                //e.printStackTrace();
            }
        }while (!completed);
    }
    public void readCommand (){
        try {
            System.out.print("" + this.user + "# ");
            String cmd = this.br.readLine().trim().toLowerCase();

            compute(cmd);
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    public void compute(String cmd){
        switch (cmd){
            case "help":
            case "h":
                displayHelp();
                break;

            case "sql":
                customSQL();
                break;

            case "show":
                showTable();
                break;

            case "select":
                selectMode();
                System.out.println(" >> Select ");
                break;

            case "update":

                break;

            case "insert":

                break;

            case "delete":
                break;

            case "create":
                break;

            case "drop":
                break;

            case "exit":
                this.active = false;
                break;
        }
    }

    public void displayHelp(){
        System.out.println("\nEnter one of the following commands at follow the prompt" +
                "\n - sql || This mode will allow you to run any full custom SQL queries" +
                "\n - show || This mode will display any table in the database"
                );
//                "\n - select || This mode provides a simplied way to run a SELECT query on the database" +
//                "\n - update - in development" +
//                "\n - insert - in development" +
//                "\n - delete - in development" +
//                "\n - create - in development" +
//                "\n - drop - in development" +
//                "\n");
    }

    private String read(){
        System.out.print(" > ");
        String line;
        try {
            line = this.br.readLine().trim().toLowerCase();
        }catch (IOException e){
            line = null;
            System.out.println("Failed to read line. ");
            //e.printStackTrace();
        }
        return line;
    }

    public void showTable(){
        boolean completed = false;

        System.out.println("\nEnter the name of the table to display" +
                "\ntype \\q  to quit out of Show Table mode");

        do{
            String tableName = read();
            if (tableName.equals("\\q")) {
                completed = true;
                System.out.println("\nExiting Show Table mode.");
            }else {
                DBTablePrinter.printTable(this.connection, tableName);
            }
        }while(!completed);
    }

    public void customSQL(){
        boolean completed = false;
        boolean toQuery = false;
        StringBuilder query = new StringBuilder();

        System.out.println("\nEnter your SQL Query in full and end in a ; " +
                "\ntype \\q  to quit out of SQL mode\n" );
        do{
            String line = read();
            if (line == null) continue;
            try {
                if (line.substring(line.length()-1).equals(";")) {
                    toQuery = true;
                }else if (line.equals("\\q")){
                    completed = true;
                    System.out.println("\nExiting SQL mode.");
                }
                query.append(line);
                query.append(" ");

                if (toQuery) {
                    sendQuery(query.toString().trim());
                    query.delete(0, query.length());
                    toQuery = false;
                }
            }catch (IndexOutOfBoundsException ex) {
                continue;
            }
        }while(!completed);
    }

    public void selectMode(){
        boolean completed = false;
        boolean toQuery = false;

        System.out.println("\nFollow the prompts as follows " +
                "\ntype \\q  to quit out of Select mode\n" );
        //do{
            String query = formSelectQuery();
            sendQuery(query.toString().trim());
        //}while(!completed);
    }

    public String formSelectQuery(){
        StringBuilder query = new StringBuilder();

        System.out.println("SELECT which attributes? (Separate with commas OR use * for all)");
        String attributes = read() + " ";
        System.out.println("FROM which table?");
        String baseTable = read() + " ";
        System.out.println("JOIN with any table? Leave blank if otherwise");
        String joinTable = read()+ " ";
        String joinType = "", onAtt = "";
        if (!joinTable.equals("")) {
            System.out.println("Please specify INNER, LEFT, RIGHT or FULL JOIN ");
            joinType = read() + " ";
            System.out.println("ON what attributes to join? ");
            onAtt = read() + " ";
        }
        System.out.println("WHERE conditional?");
        String whereCondition = read();


        query.append("SELECT");
        query.append(attributes);
        query.append("FROM");
        query.append(baseTable);
        if (!joinTable.equals("")){
            query.append(joinType);
            query.append("JOIN");
            query.append(joinTable);
            query.append("ON");
            query.append(onAtt);
        }
        query.append("WHERE");
        query.append(whereCondition);
        query.append(";");

        return query.toString().trim();
    }

    public boolean sendQuery(String query){
        ResultSet rs;

        try{
            Statement st = this.connection.createStatement();
            //System.out.println(query);
            rs = st.executeQuery(query);
        }catch(SQLException e){
            if (e.getSQLState().equals("02000")){
                return true;
            }else {
                //e.printStackTrace();
                System.out.println("SQL STATE: " + e.getSQLState());
                System.out.println("MSG: " + e.getMessage());
                return false;
            }
        }

        DBTablePrinter.printResultSet(rs);
        return true;
    }


    public static void main(String[] args){
        SQL_CLI program = new SQL_CLI();
        program.run();
    }
}
