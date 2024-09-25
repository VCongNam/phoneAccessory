import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AdminDash.css";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [newAccount, setNewAccount] = useState({
    user_name: "",
    password: "",
    role_id: "", // Adjust default role as needed
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from("account") // Replace 'account' with your actual table name
          .select("*");

        if (error) {
          alert("Error fetching accounts: " + error.message);
        } else {
          setAccounts(data);
        }
      } catch (error) {
        alert("Unexpected error fetching accounts: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleCreateAccount = async () => {
    const { user_name, password, role_id } = newAccount;
    if (!user_name || !password || !role_id) {
      alert("All input fields must be filled before creating an account");
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("account")
        .insert([{ user_name, password, role_id }])
        .select();
  
      if (error) {
        console.error("Error creating account:", error);
        alert("Error creating account: " + error.message);
      } else if (data && data.length > 0) {
        // Update the account list
        setAccounts(prevAccounts => [...prevAccounts, data[0]]); 
        
        alert("Account created successfully!");
  
        // Reset form
        setNewAccount({
          user_name: "",
          password: "",
          role_id: "", 
        });
      } else {
        console.warn("No data returned after account creation");
        alert("Account may have been created, but no data was returned");
      }
    } catch (error) {
      console.error("Unexpected error creating account:", error);
      alert("Unexpected error creating account: " + error.message);
    }
  };
  

  // Update existing account
  const handleUpdateAccount = async (updatedAccount) => {
    try {
      const { error } = await supabase
        .from("account")
        .update(updatedAccount)
        .eq("user_id", updatedAccount.user_id);

      if (error) {
        alert("Error updating account: " + error.message);
      } else {
        alert("Update account success!");
        setAccounts(
          accounts.map((account) =>
            account.user_id === updatedAccount.user_id
              ? updatedAccount
              : account
          )
        );
        setEditingAccountId(null);
      }
    } catch (error) {
      alert("Unexpected error updating account: " + error.message);
    }
  };

  // Delete account
  const handleDeleteAccount = async (accountId) => {
    try {
      const { error } = await supabase
        .from("account")
        .delete()
        .eq("user_id", accountId);

      if (error) {
        alert("Error deleting account: " + error.message);
      } else {
        alert("Delete account success!");
        setAccounts(
          accounts.filter((account) => account.user_id !== accountId)
        );
      }
    } catch (error) {
      alert("Unexpected error deleting account: " + error.message);
    }
  };

  return (
    <div className="admin-account-table">
      <h2>Account Table</h2>
      {/* Create Account Form */}
      <h3>Create New Account</h3>
      <div>
        <input
          type="text"
          placeholder="User Name"
          value={newAccount.user_name}
          onChange={(e) =>
            setNewAccount({ ...newAccount, user_name: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={newAccount.password}
          onChange={(e) =>
            setNewAccount({ ...newAccount, password: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Role ID"
          value={newAccount.role_id}
          onChange={(e) =>
            setNewAccount({ ...newAccount, role_id: e.target.value })
          }
        />
        {/* Add more fields for other account properties as needed */}
        <button onClick={handleCreateAccount}>Create</button>
      </div>
      {/* Account Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Role ID</th>
              <th>User Name</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.user_id}>
                {editingAccountId === account.user_id ? (
                  <>
                    <td>{account.user_id}</td> {/* User ID is not editable */}
                    <td>
                      <input
                        type="text"
                        value={account.role_id}
                        onChange={(e) =>
                          setAccounts(
                            accounts.map((a) =>
                              a.user_id === account.user_id
                                ? { ...a, role_id: e.target.value }
                                : a
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={account.user_name}
                        onChange={(e) =>
                          setAccounts(
                            accounts.map((a) =>
                              a.user_id === account.user_id
                                ? { ...a, user_name: e.target.value }
                                : a
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="password"
                        value={account.password}
                        onChange={(e) =>
                          setAccounts(
                            accounts.map((a) =>
                              a.user_id === account.user_id
                                ? { ...a, password: e.target.value }
                                : a
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <button onClick={() => handleUpdateAccount(account)}>
                        Save
                      </button>
                      <button onClick={() => setEditingAccountId(null)}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{account.user_id}</td>
                    <td>{account.role_id}</td>
                    <td>{account.user_name}</td>
                    <td>{account.password}</td>
                    <td>
                      <button
                        onClick={() => setEditingAccountId(account.user_id)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.user_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountManagement;
